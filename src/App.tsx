import "./index.css";
import "./App.css";
import { Link } from "./components/Link";

function App() {
	return (
		<>
			<div className="flex min-h-screen max-h-full justify-center items-center">
				<div className="header">
					<h1 className="text-2xl md:text-4xl lg:text-7xl font-bold text-white mb-4">haroon bakhsh</h1>
					<div className="flex flex-col md:flex-row">
						<Link link="mailto:h@hbak.co" content="h@hbak.co" />
						<Link link="https://github.com/hmbakhsh" content="github/hmbakhsh" />
						<Link link="https://x.com/hmbakhsh" content="x/hmbakhsh" />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
2;
