'use client';

import type { WorkPayload } from '@/lib/definitions';

type Props = {
  payload?: WorkPayload;
};

export default function WorkWindow({ payload }: Props) {
  return (
    <div className="p-4">
      <h1>Work Window</h1>
      {payload?.projectId ? (
        <p>Deep-link to project: {payload.projectId}</p>
      ) : (
        <p>No project selected yet.</p>
      )}
    </div>
  );
}
