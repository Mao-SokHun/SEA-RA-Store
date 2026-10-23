import { Request, Response, NextFunction } from 'express';

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Recursively cleans objects in-place to prevent Prototype Pollution and injection attacks:
 * - Deletes __proto__, constructor, and prototype keys
 * - Strips null-byte characters (\0) which can be used to bypass file extensions / SQL parsers
 * - Modifies properties in-place so it is 100% compatible with Express 5 getter properties (req.query)
 */
function cleanInPlace(target: any): void {
  if (!target || typeof target !== 'object') {
    return;
  }

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (typeof target[i] === 'string') {
        target[i] = target[i].replace(/\0/g, '');
      } else if (typeof target[i] === 'object' && target[i] !== null) {
        cleanInPlace(target[i]);
      }
    }
    return;
  }

  for (const key of Object.keys(target)) {
    if (FORBIDDEN_KEYS.has(key)) {
      delete target[key];
      continue;
    }

    if (typeof target[key] === 'string') {
      target[key] = target[key].replace(/\0/g, '');
    } else if (typeof target[key] === 'object' && target[key] !== null) {
      cleanInPlace(target[key]);
    }
  }
}

export function payloadSanitizer(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      cleanInPlace(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      cleanInPlace(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      cleanInPlace(req.params);
    }
    next();
  } catch (error) {
    next(error);
  }
}
