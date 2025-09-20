export default function AboutPage() {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">About This Project</h1>

        <div className="mt-4">
          <p><strong>Name:</strong> Kenneth Lay</p>
          <p><strong>LTU Student Id:</strong> 22586517</p>
        </div>
  
        <div className="mt-8">
          <h2 className="text-xl font-semibold">How to Use This Website</h2>
          <p className="mt-2">
            A video walkthrough will be placed here.
          </p>
          {/* Video*/}
        </div>
      </main>
    );
  }