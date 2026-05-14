declare module "*.worker.ts?worker&inline" {
  const WorkerConstructor: new () => Worker;
  export default WorkerConstructor;
}
