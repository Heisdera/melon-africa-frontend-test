import Image from 'next/image'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        width={150}
        height={40}
        src="/images/image1.png"
        alt="melon africa logo"
      />
    </Link>
  )
}
