export const victoryPieMock = jest.fn();

export const VictoryPie = (props: any) => {
    victoryPieMock(props);
    return null;
};

export const VictoryTheme = {
    material: {},
};
