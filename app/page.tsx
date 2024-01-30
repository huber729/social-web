import Link from "next/link"

export default function Home() {
  return (
    <div>
      <p>Welcome to my Post app. Please navigate to the feed by clicking the "Feed" button below!</p>
      <Link href="/feed">
        <h1 style={{ fontWeight: "bold" }}>Feed</h1>
      </Link>
    </div>
  )
  }
