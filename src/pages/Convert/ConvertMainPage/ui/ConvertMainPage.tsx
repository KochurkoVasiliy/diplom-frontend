import block from 'bem-cn-lite';
import {ROUTES} from '@/shared';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import {Button, Card, Col, Container, Flex, Row, Text} from '@gravity-ui/uikit';
import './ConvertMainPage.scss';

const b = block('ConversionMainPage');

const ConvertMainPage = () => {
    const conversions = [
        {
            name: 'ONNX -> TRT',
            route: ROUTES.onnxToTrtConverterRoute,
            description: 'Конвертируйте модели ONNX в TensorRT.',
        },
        {
            name: 'В разработке...',
            route: '#',
            description: 'Скоро появятся новые типы конвертаций.',
            disabled: true,
        },
    ];

    return (
        <Container maxWidth={'xxl'} className={b()} gutters={'4'}>
            <Row space="5">
                <Col s="12">
                    <Text variant="header-1">Конвертер моделей</Text>
                </Col>

                {conversions.map((conversion, index) => (
                    <Col key={index} s="12" m="6" l="6">
                        <Card
                            type="container"
                            view="filled"
                            className={b('card', {disabled: conversion.disabled})}
                        >
                            <Flex direction="column" space="4">
                                <Text variant="header-2">{conversion.name}</Text>
                                <Text color="secondary">{conversion.description}</Text>
                                <Button
                                    view="action"
                                    size="l"
                                    href={conversion.route}
                                    disabled={conversion.disabled}
                                    width="max"
                                >
                                    {conversion.disabled ? 'Скоро' : 'Перейти'}
                                </Button>
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ConvertMainPage;
