'use client';

import Pixelation from '@/components/Pixelation';

// import Image from 'next/image';

const imageUrls = [
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp',
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp',
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp',
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp',
  'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg.webp',
];

const ProjectDetailPage = () => {
  return (
    <div className="flex w-full flex-col gap-4 px-1 py-10">
      <h1 className="text-2xl font-bold">title</h1>
      <div className="flex gap-4">
        <a href="https://www.google.com/" target="_blank" className="text-blue-500 underline">
          website
        </a>
        <a href="https://www.google.com/" target="_blank" className="text-blue-500 underline">
          github
        </a>
      </div>
      <div className="flex gap-4">
        <div>skills</div>
        <div>skills</div>
        <div>skills</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {imageUrls.map((url, i) => (
          <div key={i} className="relative aspect-square w-full overflow-hidden">
            <Pixelation src={url} />
            {/* <Image src={url} alt={`image-${i}`} fill objectFit="cover" /> */}
          </div>
        ))}
      </div>

      <p>description</p>
    </div>
  );
};

export default ProjectDetailPage;
