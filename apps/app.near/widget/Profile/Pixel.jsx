const { Root } = VM.require("app.near/widget/Profile.Pixel.Root") || {
  Root: () => <></>,
};

const { FollowStats, Button, Hashtag, LinkTree } = VM.require(
  "app.near/widget/Components.Pixel",
) || {
  FollowStats: () => <></>,
  Button: () => <></>,
  Hashtag: () => <></>,
  LinkTree: () => <></>,
};

const { CopyIcon2, EditIcon2, LinkIcon2 } = VM.require(
  "app.near/widget/Icons",
) || {
  CopyIcon2: () => <></>,
  EditIcon2: () => <></>,
  LinkIcon2: () => <></>,
};

const accountId = props.accountId ?? context.accountId;

if (!accountId) {
  return (
    <div>
      <p>No user signed in or AccountId passed</p>
    </div>
  );
}

const profile = Social.getr(`${accountId}/profile`);
const profileTags = Object.keys(profile.tags || []);

const theme = profile.profileTheme ?? "light";

const ProfileImagesContainer = styled.div`
  position: relative;
`;

const BackgroundImage = styled.div`
  img {
    width: 100%;
    height: 240px;
    object-fit: cover;

    @media screen and (max-width: 768px) {
      height: 80px;
    }
  }
`;

const ProfileImage = styled.div`
  position: absolute;
  bottom: -40px;
  left: 40px;
  transform: translateY(5%);

  img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 100%;
    border: 4px solid var(--profile-stroke);
  }

  @media screen and (max-width: 768px) {
    img {
      width: 80px;
      height: 80px;
    }
    left: 20px;
    bottom: 0;
    transform: translateY(50%);
  }
`;

const ProfileInfoContainer = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  flex-shrink: 0;
  width: 436px;

  border-radius: 16px;
  border: 1px solid var(--stroke);
  background: var(--bg1);

  box-shadow: 0px 4px 8px -2px var(--shadow);
`;

const ProfileName = styled.h2`
  color: var(--color);
  font-family: "Pixelify Sans", "InterVariant", sans-serif;
  font-size: 48px;
  font-weight: 400;
  margin: 0;

  display: inline-flex;
  gap: 8px;
  align-items: center;

  svg {
    scale: 1.25;
    margin-bottom: 6px;
  }
`;

const ContentContainer = styled.div`
  margin-top: 64px;
`;

const AccountName = styled.div`
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: var(--color-muted);
  font-family: InterVariable;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */

  span {
    cursor: pointer;
    margin-top: 3px;
  }
`;

return (
  <Root theme="light">
    <ProfileImagesContainer>
      <BackgroundImage>
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.backgroundImage,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreic5bphlb7v324i4ztzrd3xif5cmpg7qynf763hw7tv27xh3dwpcf4",
          }}
        />
      </BackgroundImage>
      <ProfileImage>
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.image,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreic5bphlb7v324i4ztzrd3xif5cmpg7qynf763hw7tv27xh3dwpcf4",
          }}
        />
      </ProfileImage>
    </ProfileImagesContainer>
    <ContentContainer className="container-xl">
      <ProfileInfoContainer>
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-column">
            <ProfileName>
              {profile.name}
              <Widget
                loading={""}
                src="mob.near/widget/Checkmark"
                props={{ accountId }}
              />
            </ProfileName>
            <AccountName>
              @{accountId}
              <span onClick={() => clipboard.writeText(accountId)}>
                <Widget
                  loading={content}
                  src="mob.near/widget/N.Common.OverlayTrigger"
                  props={{
                    popup: <div>Copy AccountId</div>,
                    children: <CopyIcon2 />,
                  }}
                />
              </span>
            </AccountName>
          </div>
          <FollowStats accountId={accountId} />
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button>
            <EditIcon2 />
            Edit Profile
          </Button>
          <OverlayTrigger
            placement="auto"
            overlay={<Tooltip>{"Copy to clipboard"}</Tooltip>}
          >
            <Button
              style={{ padding: "12px 14px" }}
              onClick={() =>
                clipboard.writeText(
                  `app.near/widget/Profile?accountId=${accountId}`,
                )
              }
            >
              <LinkIcon2 />
            </Button>
          </OverlayTrigger>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {profileTags.length > 0 &&
            profileTags.map((tag) => <Hashtag key={tag}>{tag}</Hashtag>)}
        </div>
        <LinkTree linkTree={profile.linktree} theme="light" />
      </ProfileInfoContainer>
    </ContentContainer>
  </Root>
);