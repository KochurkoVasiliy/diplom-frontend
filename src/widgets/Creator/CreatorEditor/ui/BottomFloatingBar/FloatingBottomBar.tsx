import {Button, Card, Flex, Icon, Text} from '@gravity-ui/uikit';
import {Plus} from '@gravity-ui/icons';

export const FloatingBottomBar = () => {
    return (
        <Card position={'absolute'} style={{left: ''}}>
            <Button onClick={() => {console.log('1')}}>
                <Flex direction={'column'} alignItems={'center'} gap={'1'}>
                    <Icon data={Plus} />
                    <Text variant={'caption-1'} color={'secondary'}>
                        Добавить слой
                    </Text>
                </Flex>
            </Button>
        </Card>
    );
};
