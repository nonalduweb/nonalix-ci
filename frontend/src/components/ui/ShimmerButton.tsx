'use client';

import React from 'react';
import Link from 'next/link';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface ButtonProps extends BaseProps {
  as?: 'button';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

interface AnchorProps extends BaseProps {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
}

interface LinkProps extends BaseProps {
  as: 'link';
  href: string;
}

type Props = ButtonProps | AnchorProps | LinkProps;

export function ShimmerButton(props: Props) {
  const { children, className = '', style } = props;
  const cls = `shimmer-btn ${className}`;

  if (props.as === 'a') {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={cls} style={style}>
        <span className="shimmer-shine" aria-hidden="true" />
        {children}
      </a>
    );
  }

  if (props.as === 'link') {
    return (
      <Link href={props.href} className={cls} style={style}>
        <span className="shimmer-shine" aria-hidden="true" />
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={cls} style={style}>
      <span className="shimmer-shine" aria-hidden="true" />
      {children}
    </button>
  );
}
