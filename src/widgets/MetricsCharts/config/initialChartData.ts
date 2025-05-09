import type {YagrWidgetData} from '@gravity-ui/chartkit/yagr';

export const initialChartData: YagrWidgetData = {
    data: {
        timeline: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        graphs: [
            // {
            //     id: '0',
            //     name: 'Serie 1',
            //     color: '#c25969',
            //     data: [25, 52, 89, 72, 39, 49, 82, 59, 36, 5],
            // },
        ],
    },
    libraryConfig: {
        chart: {series: {type: 'line'}},
        title: {text: 'loss'},
        tooltip: {show: true},
    },
};

/*
*
* @app.post('/start-optimization')
async def train(
    scriptFile: UploadFile = File(...),
    datasetFile: UploadFile = File(...),
    experimentName: str = Form(...),
    learningRate: float = Form(...),
    modelCheckPoint: bool = Form(...),
    optimizer: str = Form(...),
    activationFunction: str = Form(...),
    epochs: int = Form(...),
    metric: str = Form(...)
):
    session_id = str(uuid.uuid4())
    tmp_dir = tempfile.mkdtemp()
    script_path = os.path.join(tmp_dir, scriptFile.filename)
    zip_path = os.path.join(tmp_dir, datasetFile.filename)

    print(script_path)
    print(zip_path)
    with open(script_path, 'wb') as f:
        f.write(await scriptFile.read())
    with open(zip_path, 'wb') as f:
        shutil.copyfileobj(datasetFile.file, f)

    extract_dir = os.path.join(tmp_dir, "data")
    os.makedirs(extract_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_dir)

    def sse_generator() -> AsyncGenerator[str, None]:
        async def generator():
            try:
                async for msg in train_model(
                    script_path=script_path,
                    data_dir=extract_dir,
                    learning_rate=learningRate,
                    epochs=epochs,
                    optimizer_name=optimizer,
                    activation=activationFunction,
                    metric_name=metric,
                    checkpoint=modelCheckPoint,
                ):
                    print(msg)
                    yield f"data: {msg}\n\n"
            finally:
                shutil.rmtree(tmp_dir, ignore_errors=True)
        return generator()

    return StreamingResponse(sse_generator(), media_type="text/event-stream")*/

// {"type": "chartUpdate", "data": {"epoch": 1, "loss": 1.7333408180071193, "val_loss": 1.1253146580118518, "metric": 0.3961834733893557, "val_metric": 0.5141113653699466}}
