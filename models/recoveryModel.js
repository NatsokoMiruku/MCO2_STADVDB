import { CentralNodeGameInformation, Node2GameInformation, Node3GameInformation } from './gameInformation.js';

export const syncData = async (sourceNode, targetNode) => {
    try {
        console.log(`Starting data sync from ${sourceNode.name} to ${targetNode.name}...`);

        const data = await sourceNode.findAll();

        let syncedCount = 0;
        for (const record of data) {
            const { AppID } = record.dataValues;

            // Check for conflicts
            const existingRecord = await targetNode.findByPk(AppID);
            if (existingRecord) {
                if (new Date(record.updatedAt) > new Date(existingRecord.updatedAt)) {
                    await targetNode.upsert(record.dataValues);
                    syncedCount++;
                }
            } else {
                await targetNode.upsert(record.dataValues);
                syncedCount++;
            }
        }

        console.log(`Data sync complete: ${syncedCount} records synced from ${sourceNode.name} to ${targetNode.name}`);
        return `${syncedCount} records synced successfully.`;
    } catch (error) {
        console.error('Error during data sync:', error);
        throw new Error('Data sync failed');
    }
};

export const recoverNode = async (node) => {
    const startTime = Date.now();
    let recoveryDetails = '';

    try {
        console.log(`Recovering ${node.name}...`);

        if (node === Node2GameInformation) {
            recoveryDetails = await syncData(CentralNodeGameInformation, Node2GameInformation);
        } else if (node === Node3GameInformation) {
            recoveryDetails = await syncData(CentralNodeGameInformation, Node3GameInformation);
        } else {
            const sync1 = await syncData(Node2GameInformation, CentralNodeGameInformation);
            const sync2 = await syncData(Node3GameInformation, CentralNodeGameInformation);
            recoveryDetails = `${sync1} | ${sync2}`;
        }

        const duration = Date.now() - startTime;
        console.log(`Recovery complete for ${node.name} in ${duration}ms`);
        await logRecovery(node, true, `Duration: ${duration}ms | Details: ${recoveryDetails}`);
        return `Recovery complete for ${node.name} in ${duration}ms`;
    } catch (error) {
        console.error('Recovery error:', error);
        await logRecovery(node, false, `Error: ${error.message}`);
        throw new Error('Recovery process failed');
    }
};

export const logRecovery = async (node, success = true, details = '') => {
    const status = success ? 'SUCCESS' : 'FAILED';
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Recovery for ${node.name}: ${status}. Details: ${details}\n`;

    try {
        const fs = await import('fs/promises');
        await fs.appendFile('./logs/recoveryLogs.log', logMessage);
        console.log(`Logged recovery for ${node.name}: ${status}`);
    } catch (error) {
        console.error('Failed to log recovery:', error);
    }
};
