// eslint-disable-next-line import/no-extraneous-dependencies
import {Landing, i18nNamespace} from '@/shared/config/i18n';
import {NotFound} from '@gravity-ui/illustrations';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Button, Flex, Text} from '@gravity-ui/uikit';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router';

const Error404Page = () => {
    const navigate = useNavigate();
    const {t, i18n} = useTranslation(i18nNamespace.landing);
    console.log(i18n.language);
    const handleBackBtnClock = () => navigate('/');
    return (
        <Flex gap={'5'} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <NotFound />
            <Text variant="display-3">{t(Landing.ERR_HEADER)}</Text>
            <Text variant="body-3">{t(Landing.ERR_SUBHEADER)}</Text>
            <Button size="xl" view="action" onClick={handleBackBtnClock}>
                {t(Landing.ERR_ACTION_HOME)}
            </Button>
        </Flex>
    );
};

export default Error404Page;
