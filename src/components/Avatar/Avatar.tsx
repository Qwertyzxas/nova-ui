import { useState, type ComponentPropsWithRef } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export interface AvatarProps extends Omit<ComponentPropsWithRef<'span'>, 'children'> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function Avatar({ name, src, size = 'md', className, ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src && failedSrc !== src;

  return (
    <span className={cx('nova-avatar', `nova-avatar--${size}`, className)} {...rest}>
      {showImage ? (
        <img src={src} alt={name} onError={() => setFailedSrc(src)} />
      ) : (
        <span role="img" aria-label={name}>
          <span aria-hidden="true">{initials(name)}</span>
        </span>
      )}
    </span>
  );
}
