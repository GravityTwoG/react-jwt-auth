import { useAuthContext } from '../contexts/AuthContext/context';
import { getRedirectURL } from '../getRedirectURL';

export type LoginWithGoogleButtonProps = {
  disabled: boolean;
  redirectPath: string;
  children?: React.ReactNode;
};

export const GoogleConsentURLButton = (props: LoginWithGoogleButtonProps) => {
  const { requestLoginWithGoogle } = useAuthContext();

  const onClick = async () => {
    try {
      const redirectURL = await requestLoginWithGoogle(
        getRedirectURL(props.redirectPath)
      );
      window.location.href = redirectURL;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={props.disabled}
      className="bg-red-500"
    >
      {props.children}
    </button>
  );
};
