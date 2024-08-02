import { useAuthContext } from '../contexts/AuthContext/context';
import { getRedirectURL } from '../getRedirectURL';
import { Button } from './Button';

export type GithubConsentURLButtonProps = {
  disabled: boolean;
  redirectPath: string;
  children?: React.ReactNode;
};

export const GithubConsentURLButton = (props: GithubConsentURLButtonProps) => {
  const { requestConsentURL } = useAuthContext();

  const onClick = async () => {
    try {
      const redirectURL = await requestConsentURL(
        'github',
        getRedirectURL(props.redirectPath)
      );
      window.location.href = redirectURL;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={props.disabled}
      className="bg-white hover:bg-gray-100 font-bold !text-gray-800 hover:text-gray-900"
    >
      {props.children}
    </Button>
  );
};
