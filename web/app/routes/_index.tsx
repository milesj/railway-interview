import ProjectList, { loader } from "./projects._index";

export { loader };

export default function Index() {
	// What to show on the homepage? Not sure...
	// Let's just show the projects for now!
	return <ProjectList />;
}
