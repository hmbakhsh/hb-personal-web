import "./index.css";
import "./App.css";

function App() {
	return (
		<>
			<div className="flex min-h-screen max-h-full justify-center items-center">
				<div className="header">
					<h1 className="text-8xl font-bold text-white">haroon bakhsh</h1>
					<a href="mailto:h@hbak.co" className="text-4xl text-indigo-300 mr-6 hover:text-indigo-100">
						h@hbak.co
					</a>
					<a href="https://x.com/hmbakhsh" className="text-4xl text-indigo-300 mr-6 hover:text-indigo-100">
						x/@hmbakhsh
					</a>
					<a href="https://github.com/hmbakhsh" className="text-4xl text-indigo-300 hover:text-indigo-100">
						github/@hmbakhsh
					</a>
				</div>
			</div>
		</>
	);
}

export default App;
