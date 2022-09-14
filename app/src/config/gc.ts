import { appLogger } from "./utils";

function runManualGarbageCollector() {
  const garbageCollectionInitialTimeout = +process.env.GARBAGE_COLLECTION_TIMEOUT! || 1000 * 60;
  const garbageCollectionInterval = +process.env.GARBAGE_COLLECTION_INTERVAL! || 1000 * 60 * 30;
  const flushMemory = () => {
    appLogger.log("Flushing garbage...");
    const start = new Date().getTime();
    global.gc!();
    const took = new Date().getTime() - start;
    appLogger.log(`Garbage flushed. Took ${took} ms.`);
    setTimeout(
      flushMemory,
      garbageCollectionInterval + Math.random() * garbageCollectionInterval * 0.1,
    );
  };

  setTimeout(() => {
    flushMemory();
  }, garbageCollectionInitialTimeout);
}

export default runManualGarbageCollector;
