import type { Click } from '@prisma/client';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { db } from '~/utils/db.server';

interface LoaderData {
  track: {
    trackId: string;
    Click: Click[];
  };
}

export const loader: LoaderFunction = async ({ params }) => {
  const track = await db.track.findUnique({
    where: {
      trackId: params.trackId,
    },
    select: {
      trackId: true,
      Click: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
    },
  });

  if (!track) {
    throw new Error(`Track ${params.trackId} does not exist`);
  }

  const data: LoaderData = { track };
  return json(data);
};

export default function TrackID() {
  const data = useLoaderData<LoaderData>();
  const [isCopied, setIsCopied] = useState(false);

  const onClipboard = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/${data.track.trackId}`,
    );
    setIsCopied(true);
  };

  const rows = data.track.Click.map((click) => (
    <tr key={click.id}>
      <td className="border-slate-600 border-2">
        {new Date(click.createdAt).toLocaleDateString('ko-KR', {
          hour12: true,
        })}
      </td>
      <td className="border-slate-600 border-2">{click.userAgent}</td>
      <td className="border-slate-600 border-2">{click.ip}</td>
    </tr>
  ));

  return (
    <div className="h-screen bg-indigo-100 flex flex-col justify-center items-center">
      <button
        onClick={onClipboard}
        className="bg-fuchsia-500 text-white px-4 py-2"
      >
        {isCopied ? 'Copied' : 'Copy'}
      </button>
      <table className="table-auto text-slate-300 bg-slate-700 border-separate border-spacing-2 border border-slate-500 ">
        <thead className="text-center">
          <tr className="">
            <th className="bg-slate-600">Date</th>
            <th className="bg-slate-600">User agent</th>
            <th className="bg-slate-600">IP</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <Link
        to={`/${data.track.trackId}`}
        className="text-white bg-fuchsia-500 px-4 py-2 cursor-pointer"
      >
        Test Link
      </Link>
    </div>
  );
}
