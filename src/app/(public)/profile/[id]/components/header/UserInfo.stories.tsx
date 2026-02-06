import type { Meta, StoryObj } from "@storybook/react";
import UserInfo from "./UserInfo";
import { useProfileStore } from "../../store/useProfileStore";
import { useEffect } from "react";

// Helper component to initialize the store for stories
const StoreInitializer = ({
  profileUser,
  isMyProfile = false,
  children,
}: {
  profileUser: any;
  isMyProfile?: boolean;
  children: React.ReactNode;
}) => {
  const actions = useProfileStore((state) => state.actions);

  useEffect(() => {
    actions.initialize({
      profileUser,
      isMyProfile,
      initialized: true,
    });
  }, [profileUser, isMyProfile, actions]);

  return <>{children}</>;
};

const meta: Meta<typeof UserInfo> = {
  title: "Profile/UserInfo",
  component: UserInfo,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story, context) => (
      <StoreInitializer
        profileUser={context.args.profileUser}
        isMyProfile={context.args.isMyProfile}
      >
        <div className="w-[400px] p-6 bg-surface rounded-xl shadow-sm border border-border">
          <Story />
        </div>
      </StoreInitializer>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserInfo>;

export const PassportAvailable: Story = {
  args: {
    profileUser: {
      name: "Ran Cohen",
      profile: {
        firstName: "Ran",
        homeBaseCity: {
          name: "Tel Aviv",
          country: { name: "Israel" },
        },
      },
    },
    isMyProfile: true,
  } as any,
};

export const PassportMissingMyProfile: Story = {
  args: {
    profileUser: {
      name: "Ran Cohen",
      profile: {
        firstName: "Ran",
        homeBaseCity: {
          name: "Tel Aviv",
          country: null,
        },
      },
    },
    isMyProfile: true,
  } as any,
};

export const PassportMissingVisitor: Story = {
  args: {
    profileUser: {
      name: "Ran Cohen",
      profile: {
        firstName: "Ran",
        homeBaseCity: {
          name: "Tel Aviv",
          country: null,
        },
      },
    },
    isMyProfile: false,
  } as any,
};
