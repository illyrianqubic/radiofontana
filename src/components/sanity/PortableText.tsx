'use client';

import {
  PortableText,
  type PortableTextReactComponents,
} from '@portabletext/react';

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="text-slate-600 leading-relaxed mb-4">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4 mt-8 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-slate-800 mb-3 mt-7 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-slate-800 mb-2 mt-5">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-500 pl-5 my-6 italic text-slate-600 text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-5 mb-4 space-y-1.5 text-slate-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-5 mb-4 space-y-1.5 text-slate-600">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    'strike-through': ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-red-600 hover:text-red-700 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const src: string | undefined =
        value?.asset?.url ?? value?.asset?._ref;
      if (!src) return null;
      // Use raw <img> since next/image requires known domains and we have unoptimized: true
      return (
        <div className="my-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value?.alt ?? ''}
            className="rounded-xl w-full h-auto shadow-sm"
          />
        </div>
      );
    },
  },
};

interface Props {
  // Accept any array so callers don't need to import Sanity types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
}

export default function SanityPortableText({ value }: Props) {
  if (!value || !Array.isArray(value)) return null;
  return (
    <PortableText
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
      components={components}
    />
  );
}
