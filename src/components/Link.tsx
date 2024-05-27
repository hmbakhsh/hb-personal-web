interface LinkProps {
	link: string;
	content: string;
}

export const Link = ({ link, content }: LinkProps) => {
	return (
		<a href={link} className="text-4xl text-indigo-300 mr-6 hover:text-indigo-100">
			{content}
		</a>
	);
};
