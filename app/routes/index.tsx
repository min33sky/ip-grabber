import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const redirectUrl = form.get('redirectUrl');

  if (typeof redirectUrl !== 'string') {
    throw new Error('Invalid redirectUrl');
  }

  const fields = { redirectUrl, trackId: nanoId() };

  const track = await db.track.create({
    data: fields,
  });

  return redirect(`/tracks/${track.trackId}`);
};

export default function Index() {
  return (
    <h1 className="h-screen bg-indigo-100">
      <Form
        method="post"
        className="flex flex-col w-full max-w-xl mx-auto pt-20 space-y-4"
      >
        <label htmlFor="" className="font-bold">
          Redirect URL <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center justify-between gap-4">
          <input
            type="url"
            name="redirectUrl"
            className="flex-1 p-4 outline-none"
            placeholder="ex) https://www.google.com"
            required
          />
          <button className="bg-indigo-500 text-white p-4">
            Create Tracker
          </button>
        </div>
      </Form>
    </h1>
  );
}
