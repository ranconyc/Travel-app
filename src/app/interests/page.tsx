"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox, Button, SelectInterests } from "../mode/page";

const interestsSchema = z.object({
  interests: z.array(z.string()),
});

type InterestsFormValues = z.infer<typeof interestsSchema>;

interface CategoryRowProps {
  title: string;
  selectedCount: number;
  onClick: () => void;
}

export const CategoryRow = ({
  title,
  selectedCount,
  onClick,
}: CategoryRowProps) => {
  return (
    <button
      onClick={onClick}
      className="text-left border-2 border-surface hover:border-brand transition-colors rounded-xl px-3 py-2 flex justify-between items-center group"
    >
      <div className="">
        <h1 className="">{title}</h1>
        {/* check y isnt working */}
        <p
          className={`text-xs ${
            selectedCount > 0 ? "text-brand" : "text-secondary"
          }`}
        >
          {selectedCount > 0 ? `${selectedCount} selected` : "Tap to select"}
        </p>
      </div>

      <ChevronRight
        className="text-secondary group-hover:text-brand transition-colors"
        size={24}
      />
    </button>
  );
};

const categories: { [key: string]: string[] } = {
  Shopping: [
    "Local markets",
    "Designer boutiques",
    "Shopping malls",
    "Souvenir hunting",
    "Night bazaars",
    "Street shopping",
  ],
  "Sport & Adventure": [
    "Surfing",
    "Snorkeling",
    "Scuba diving",
    "Kayaking",
    "Jet skiing",
    "Rock climbing",
    "Zip-lining",
    "Cycling tours",
    "Skiing",
    "Golfing",
    "Paragliding",
    "Skydiving",
  ],
  "Art & Culture": [
    "Museums",
    "Art galleries",
    "Historic landmarks",
    "Temples or churches",
    "Cultural festivals",
    "Live performances",
    "Cooking classes",
    "Craft workshops",
  ],
  "Nature & Hiking": [
    "National park hiking",
    "Waterfall visits",
    "Cave exploration",
    "Mountain trekking",
    "Nature walks",
    "Wildlife safaris",
    "Camping",
    "Stargazing",
  ],
  "Wellness & Relaxation": [
    "Spa treatments",
    "Yoga retreats",
    "Meditation",
    "Beach lounging",
    "Hot springs",
    "Wellness resorts",
    "Detox programs",
  ],
  "Food & Drink": [
    "Street food tours",
    "Fine dining",
    "Wine tasting",
    "Brewery tours",
    "Cooking classes",
    "Nightlife",
    "Bars & clubs",
  ],
  "Sightseeing & Experiences": [
    "City tours",
    "Sunset cruises",
    "Island hopping",
    "Scenic train rides",
    "Boat tours",
    "Theme parks",
    "Local festivals",
    "Markets",
  ],
  "Social & Local Experiences": [
    "Volunteering",
    "Meeting locals",
    "Joining group tours",
    "Homestays",
    "Cultural exchanges",
    "Travel meetups",
  ],
};

const categoryNames = Object.keys(categories);

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
      <div className={`h-full bg-brand w-[${percentage * 100}%]`} />
    </div>
  );
};

const Modal = ({
  category = "Shopping",
  onClose,
  selectedInterests,
  onOptionToggle,
}: {
  category: string;
  onClose: () => void;
  selectedInterests: string[];
  onOptionToggle: (option: string) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-blur flex items-end  z-50">
      <div className="w-full h-fit bg-app-bg m-3 p-6 rounded-3xl">
        <div className="flex justify-end">
          <X className="cursor-pointer" size={20} onClick={onClose} />
        </div>
        <h1 className="text-xl font-bold mb-2">{category}</h1>
        <p className="mb-4 text-sm font-bold text-secondary">
          Tap to select / deselect
        </p>
        <div className="grid gap-2 overflow-y-scroll max-h-[400px]">
          {categories[category].map((option) => (
            <Checkbox
              key={option}
              id={option}
              label={option}
              isSelected={selectedInterests.includes(option)}
              onChange={() => onOptionToggle(option)}
            />
          ))}
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function InterestsFormPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { setValue, watch, handleSubmit } = useForm<InterestsFormValues>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: [],
    },
  });

  const selectedInterests = watch("interests");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleOptionToggle = (option: string) => {
    const isSelected = selectedInterests.includes(option);
    if (isSelected) {
      setValue(
        "interests",
        selectedInterests.filter((i) => i !== option)
      );
    } else {
      setValue("interests", [...selectedInterests, option]);
    }
  };

  const getSelectedCountForCategory = (category: string) => {
    const options = categories[category];
    return selectedInterests.filter((interest) => options.includes(interest))
      .length;
  };

  const onSubmit = (data: InterestsFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen bg-app-bg p-4 pb-24">
      <div className="fixed top-0 left-0 right-0 bg-app-bg/80 backdrop-blur-md z-40 p-4 pt-8">
        <div className="flex items-center gap-2">
          <ChevronLeft className="cursor-pointer" />
          <ProgressBar
            percentage={selectedInterests.length / categoryNames.length}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 pt-20">
          <h1 className="text-xl font-bold mb-3">
            What do you enjoy when traveling?
          </h1>
          <p className="mb-8 font-medium">
            Help us personalize your trip recommendations
          </p>
        </div>

        {selectedInterests.length > 0 && (
          <div className="mb-8">
            <h1 className="text-xl font-bold mb-4">You&apos;re into:</h1>
            <ul className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <SelectInterests
                  key={interest}
                  item={interest}
                  onClick={() => handleOptionToggle(interest)}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          <h2 className="text-xs font-bold text-secondary">
            Select all that interest you
          </h2>
          {categoryNames.map((category) => (
            <CategoryRow
              key={category}
              title={category}
              selectedCount={getSelectedCountForCategory(category)}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-app-bg border-t border-surface">
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </div>
      </form>

      {showModal && (
        <Modal
          category={selectedCategory || ""}
          onClose={() => {
            // console.log("close", selectedInterests);
            setShowModal(false);
          }}
          selectedInterests={selectedInterests}
          onOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  );
}
