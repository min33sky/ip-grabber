import React, { useEffect, useRef, useState } from 'react';
import { Waveform } from '@uiball/loaders';
import { Form } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';

export const action: ActionFunction = async ({ request, params }) => {
  const track = await db.track.findUnique({
    where: {
      trackId: params.trackId,
    },
    select: {
      redirectUrl: true,
      id: true,
    },
  });

  if (!track) {
    throw new Error(`Track ${params.trackId} does not exist`);
  }

  const form = await request.formData();
  const ip = form.get('ip');

  if (typeof ip !== 'string') {
    throw new Error('Missing user data');
  }

  const userAgent = request.headers.get('user-agent');

  if (typeof userAgent !== 'string') {
    throw new Error('Missing user data');
  }

  const fields = { userAgent, ip, trackId: track.id };

  await db.click.create({
    data: fields,
  });

  return redirect(track.redirectUrl);
};

export default function TrackRoute() {
  const [ip, setIp] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIp(data.ip));
  }, []);

  useEffect(() => {
    if (ip) {
      formRef.current?.submit();
    }
  }, [ip]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-indigo-100">
      <div className="flex flex-col space-y-4">
        <div
          className="flex justify-center"
          aria-live="polite"
          aria-busy="true"
        >
          <Waveform />
        </div>
        <Form method="post" ref={formRef}>
          <input type="text" className="p-2" name="ip" defaultValue={ip} />
        </Form>
      </div>
    </div>
  );
}
