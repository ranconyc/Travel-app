export default async function CountryMatesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <h1>CountryMatesPage {slug}</h1>
      <p>
        TODO: Implement country mates page find matesThat looking to visit this
        country
      </p>
    </div>
  );
}
