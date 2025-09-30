import Link from 'next/link';

export default function Header() {
  const LTUID = "22586517";

  return (
    <header className="border-b ">
      <div className=" mx-auto flex justify-center items-center relative p-2">
        <h1 className="text-2xl font-bold">Title</h1>
        <div className="font-mono text-sm absolute right-4">{LTUID}</div>
      </div>

      <div className=" mx-auto flex justify-between items-center p-2 border-t">
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="pr-4 border-r border-gray-400"><Link href="/" className="font-bold">Tabs</Link></li>
            <li className="pr-4 border-r border-gray-400"><Link href="#">Pre-lab Questions</Link></li>
            <li className="pr-4 border-r border-gray-400"><Link href="/escape-room">Escape Room</Link></li>
            <li><Link href="/coding-race">Coding Races</Link></li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/about">About</Link>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
}