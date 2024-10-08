import { useAuthContext } from '@/contexts/AuthContext/context';
import { getRedirectURL } from '@/utils';

export type useConsentURLArgs = {
  redirectPath: string;
  provider: string;
};

export const useConsentURL = (args: useConsentURLArgs) => {
  const { requestConsentURL } = useAuthContext();

  const onClick = async () => {
    try {
      const redirectURL = await requestConsentURL(
        args.provider,
        getRedirectURL(args.redirectPath)
      );
      console.log('redirectURL', redirectURL);
      window.location.href = redirectURL;
    } catch (error) {
      console.error(error);
    }
  };

  return onClick;
};
