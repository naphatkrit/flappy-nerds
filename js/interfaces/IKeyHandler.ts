interface IKeyHandler {
    keyCode: number;
    keyDisplay: string;
    help: string;
    handler: (event)=>void;
}
