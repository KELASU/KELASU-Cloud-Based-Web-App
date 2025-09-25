export default function Footer() {
    const currentYear = new Date().getFullYear();
    const studentName = "Kenneth Lay";
    const LTUID = "22586517";
  
    return (
      <footer className="border-t mt-12">
        <div className="container mx-auto text-center text-sm text-gray-500 p-4">
          <p>
            Copyright &copy; {currentYear} | {studentName} | {LTUID} | {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    );
  }