export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div id="ddd-catalog-page" className="relative">
			{children}
		</div>
	)
}
