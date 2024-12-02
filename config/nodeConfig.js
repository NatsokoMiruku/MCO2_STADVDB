export const NODE_CONFIG = {
    central: {
        name: 'Central Node',
        host: 'ccscloud.dlsu.edu.ph',
        port: 20722,
        role: 'master', // Central node is the primary node for coordination
    },
    node2: {
        name: 'Node 2',
        host: 'ccscloud.dlsu.edu.ph',
        port: 20732,
        role: 'replica', // Replica node for partial or full data
    },
    node3: {
        name: 'Node 3',
        host: 'ccscloud.dlsu.edu.ph',
        port: 20742,
        role: 'replica', // Replica node for partial or full data
    },
    replicationStrategy: {
        type: 'partial', // Options: 'full', 'partial'
        description: 'Partial replication where each node holds specific data fragments.',
    },
    fragmentationStrategy: {
        type: 'horizontal', // Options: 'horizontal', 'vertical'
        description: 'Horizontal fragmentation where rows are divided across nodes.',
    },
    isolationLevels: {
        readUncommitted: true,
        readCommitted: true,
        repeatableRead: true,
        serializable: true,
    },
};
