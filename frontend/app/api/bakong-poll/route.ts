import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { md5, orderNumber } = await req.json();

    if (!md5) {
      return NextResponse.json(
        { isPaid: false, message: 'MD5 hash is required' },
        { status: 400 }
      );
    }

    const token =
      process.env.BAKONG_API_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYTlhNjU1YzFlN2VhNGQyMCJ9LCJpYXQiOjE3OTI4MTYxOTIsImV4cCI6MTgwMDU5MjE5Mn0.KBJUTr7GfMkf6Uf89womJd6dUq8llQmv82JA52mxjl4';

    const bakongRes = await fetch(
      'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ md5 }),
      }
    );

    if (bakongRes.ok) {
      const data = await bakongRes.json();
      if (data.responseCode === 0 && data.data) {
        return NextResponse.json({
          isPaid: true,
          status: 'completed',
          orderNumber,
          data: data.data,
          message: 'Payment verified and confirmed by Bakong network!',
        });
      }
    }

    return NextResponse.json({
      isPaid: false,
      status: 'pending',
      orderNumber,
      message: 'Awaiting customer payment',
    });
  } catch (err: any) {
    return NextResponse.json(
      { isPaid: false, error: err.message },
      { status: 500 }
    );
  }
}
