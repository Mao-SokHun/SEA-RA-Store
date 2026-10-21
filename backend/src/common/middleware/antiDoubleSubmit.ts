import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface LockEntry {
  inFlight: boolean;
  timestamp: number;
  timer: NodeJS.Timeout;
}

// In-memory high-performance lock map with TTL auto-cleanup
const actionLocks = new Map<string, LockEntry>();

export interface AntiDoubleSubmitOptions {
  windowMs?: number; // Duration to lock the action in ms (default: 3000ms)
  message?: string;
}

/**
 * Middleware: Anti-Double Submit / Duplicate Action Protection
 * Prevents duplicate database mutations when a user or client double-clicks,
 * triple-clicks, or rapidly spams action buttons while request #1 is in flight.
 *
 * Supports:
 * 1. Standard RFC `Idempotency-Key` or `X-Idempotency-Key` header
 * 2. Automatic Action Fingerprint based on User ID + HTTP Method + URL Path + Body Hash
 */
export function preventDoubleSubmit(options?: AntiDoubleSubmitOptions) {
  const windowMs = options?.windowMs || 3000;
  const message =
    options?.message ||
    'Your previous request is still processing or was just submitted. Please do not click multiple times.';

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only apply to state-modifying HTTP methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Determine lock key
    const idempotencyHeader = req.headers['x-idempotency-key'] || req.headers['idempotency-key'];
    let lockKey: string;

    const userIdentifier = req.user?.id || req.ip || 'anonymous';

    if (idempotencyHeader && typeof idempotencyHeader === 'string') {
      lockKey = `idem:${userIdentifier}:${idempotencyHeader.trim()}`;
    } else {
      // Automatic Action Fingerprint: user + method + route + SHA256 of body
      let bodyString = '';
      try {
        bodyString = JSON.stringify(req.body || {});
      } catch {
        bodyString = '';
      }

      const bodyHash = crypto
        .createHash('sha256')
        .update(bodyString)
        .digest('hex')
        .slice(0, 16);

      lockKey = `action:${userIdentifier}:${req.method}:${req.baseUrl + req.path}:${bodyHash}`;
    }

    const existingLock = actionLocks.get(lockKey);

    if (existingLock) {
      const remainingMs = Math.max(0, windowMs - (Date.now() - existingLock.timestamp));
      const retryAfterSeconds = Math.ceil(remainingMs / 1000);

      res.setHeader('Retry-After', retryAfterSeconds.toString());
      res.setHeader('X-Action-Locked', 'true');

      res.status(409).json({
        success: false,
        code: 'DUPLICATE_ACTION_IN_PROGRESS',
        message,
        retryAfterMs: remainingMs,
      });
      return;
    }

    // Set lock entry
    const timer = setTimeout(() => {
      actionLocks.delete(lockKey);
    }, windowMs);

    actionLocks.set(lockKey, {
      inFlight: true,
      timestamp: Date.now(),
      timer,
    });

    // When response finishes, keep lock until timer expires (prevents trailing clicks)
    res.on('finish', () => {
      const entry = actionLocks.get(lockKey);
      if (entry) {
        entry.inFlight = false;
      }
    });

    // If client terminates connection abruptly before response finishes
    res.on('close', () => {
      const entry = actionLocks.get(lockKey);
      if (entry && entry.inFlight && !res.writableEnded) {
        clearTimeout(entry.timer);
        actionLocks.delete(lockKey);
      }
    });

    next();
  };
}

export default preventDoubleSubmit;
