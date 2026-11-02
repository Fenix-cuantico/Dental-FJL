import React from 'react';

export type IconName =
  | 'grid'
  | 'calendar'
  | 'users'
  | 'user'
  | 'file'
  | 'tooth'
  | 'clipboard'
  | 'card'
  | 'settings'
  | 'lock'
  | 'message'
  | 'search'
  | 'plus'
  | 'star'
  | 'sun'
  | 'moon'
  | 'bell'
  | 'phone'
  | 'mail'
  | 'eye'
  | 'edit'
  | 'trash'
  | 'chevron'
  | 'chevron-r'
  | 'chevron-l'
  | 'database'
  | 'receipt'
  | 'menu'
  | 'x'
  | 'check'
  | 'dollar'
  | 'activity'
  | 'building'
  | 'download'
  | 'filter'
  | 'shield'
  | 'clock'
  | 'venus'
  | 'mars'
  | 'pin'
  | 'layers'
  | 'eraser'
  | 'printer'
  | 'save'
  | 'headset'
  | 'tag'
  | 'alert'
  | 'list'
  | 'arrow-left'
  | 'upload'
  | 'folder'
  | 'image';

interface IconProps {
  name: IconName;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md', style }) => {
  const pixelSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 18;

  const renderPath = () => {
    switch (name) {
      case 'grid':
        return (
          <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </>
        );
      case 'calendar':
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        );
      case 'users':
        return (
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        );
      case 'user':
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case 'file':
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M8 13h8M8 17h8" />
          </>
        );
      case 'tooth':
        return (
          <path d="M7.5 3C5 3 3 4.8 3 7.6c0 2 .8 3.5 1.5 5.4.7 1.9.8 4 1.5 6.3.4 1.3 1.6 1.6 2.2.5.8-1.5.9-4.2 3.8-4.2s3 2.7 3.8 4.2c.6 1.1 1.8.8 2.2-.5.7-2.3.8-4.4 1.5-6.3.7-1.9 1.5-3.4 1.5-5.4C21 4.8 19 3 16.5 3c-1.7 0-2.8 1-4.5 1S9.2 3 7.5 3z" />
        );
      case 'clipboard':
        return (
          <>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M9 12h6M9 16h6" />
          </>
        );
      case 'card':
        return (
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20M6 15h4" />
          </>
        );
      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </>
        );
      case 'lock':
        return (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </>
        );
      case 'activity':
        return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
      case 'download':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </>
        );
      case 'printer':
        return (
          <>
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </>
        );
      case 'dollar':
        return <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
      case 'alert':
        return <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />;
      case 'check':
        return <path d="M20 6L9 17l-5-5" />;
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="7.5" />
            <path d="M21 21l-4.3-4.3" />
          </>
        );
      case 'plus':
        return <path d="M12 5v14M5 12h14" />;
      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        );
      case 'moon':
        return <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </>
        );
      case 'shield':
        return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
      case 'edit':
        return (
          <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </>
        );
      case 'trash':
        return (
          <>
            <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </>
        );
      case 'eye':
        return (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        );
      case 'phone':
        return <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />;
      case 'mail':
        return (
          <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6l-10 7L2 6" />
          </>
        );
      case 'pin':
        return (
          <>
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </>
        );
      case 'menu':
        return <path d="M3 6h18M3 12h18M3 18h18" />;
      case 'x':
        return <path d="M18 6L6 18M6 6l12 12" />;
      case 'chevron':
        return <path d="M6 9l6 6 6-6" />;
      case 'chevron-r':
        return <path d="M9 6l6 6-6 6" />;
      case 'chevron-l':
        return <path d="M15 18l-6-6 6-6" />;
      case 'database':
        return (
          <>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </>
        );
      case 'receipt':
        return <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM8 7h8M8 11h8M8 15h4" />;
      case 'filter':
        return <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;
      case 'star':
        return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />;
      case 'eraser':
        return <path d="M20 20H9l-5.5-5.5a2 2 0 0 1 0-2.8L12.2 3a2 2 0 0 1 2.8 0l5.5 5.5a2 2 0 0 1 0 2.8L11 21" />;
      case 'building':
        return (
          <>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
          </>
        );
      case 'layers':
        return <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
      case 'venus':
        return (
          <>
            <circle cx="12" cy="8" r="5" />
            <path d="M12 13v8M9 18h6" />
          </>
        );
      case 'mars':
        return (
          <>
            <circle cx="10" cy="14" r="5" />
            <path d="M14 10l7-7M15 3h6v6" />
          </>
        );
      case 'save':
        return (
          <>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </>
        );
      case 'headset':
        return (
          <>
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </>
        );
      case 'tag':
        return (
          <>
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <circle cx="7" cy="7" r="1.5" />
          </>
        );
      case 'list':
        return (
          <>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </>
        );
      case 'arrow-left':
        return (
          <>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </>
        );
      case 'upload':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </>
        );
      case 'folder':
        return (
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        );
      case 'image':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </>
        );
      default:
        return <circle cx="12" cy="12" r="10" />;
    }
  };

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ic ${className}`}
      style={style}
    >
      {renderPath()}
    </svg>
  );
};
