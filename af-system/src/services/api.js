const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = async (callback) => {
    await delay();
    return callback();
}