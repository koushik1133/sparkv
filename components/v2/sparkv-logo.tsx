import Image from "next/image";

export function SparkVLogo({ className = "" }: { className?: string }) {
  return <Image className={`sparkv-logo ${className}`} src="/sparkv-logo.png" alt="SparkV" width={132} height={42} priority />;
}
