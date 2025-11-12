import Logo from "@/app/component/Logo";

const headerStyle = "text-4xl font-bold mb-6";

export default async function TravelPreferencesPage() {
  const CATEGORIES: {
    id: string;
    title: string;
    color?: string;
    emoji?: string;
  }[] = [
    { id: "shopping", title: "Shopping", emoji: "💎" },
    { id: "wellness", title: "Wellness & Relaxation", emoji: "🧖" },
    { id: "food", title: "Food & Drink", emoji: "🍸" },
    { id: "adventure", title: "Sport & Adventure", emoji: "⛰️" },
    { id: "culture", title: "Art & Culture", emoji: "🏛️" },
    { id: "nature", title: "Nature & Hiking", emoji: "🌿" },
    { id: "social", title: "Social & Local Experiences", emoji: "🧭" },
  ];

  return (
    <div>
      <header className="bg-black p-4 text-white">
        <div className="flex items-center ">
          <Logo />
        </div>

        <div className="mt-8">
          <h1 className="text-base">Tell us about your</h1>
          <h1 className="text-[32px] capitalize">travel preferences</h1>
        </div>
      </header>
      <main>
        <div>selected preferences</div>
        {/* form */}
        <form className="p-4 space-y-4">
          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <label
                htmlFor={category.id}
                className="border border-gray-300 rounded-xl p-4 space-x-4 cursor-pointer checked:bg-red-200 flex items-center "
              >
                <div className="text-base">{category.emoji}</div>
                <div className="text-base">{category.title}</div>

                <input
                  type="checkbox"
                  id={category.id}
                  name={category.id}
                  className="bg-black w-4 h-4 checked:gb-black ml-auto"
                />
              </label>
            </div>
          ))}

          {/* buttons */}
          <div className="bg-white absolute bottom-0 left-0 right-0 flex justify-between p-4 border-t border-gray-300">
            <button type="submit">back</button>
            <button type="submit">Next</button>
          </div>
        </form>
      </main>
    </div>
  );
}
