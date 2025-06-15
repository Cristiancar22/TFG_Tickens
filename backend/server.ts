import { PORT } from './config/env';
import app from './index';
import { logger } from './utils/logger';

app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
}).on('error', (error: NodeJS.ErrnoException) => {
    logger.error('Server failed to start:', error.message);
    process.exit(1);
});
