function calculateVotes(incomingVotes) {
    if(incomingVotes < 0) return `- ${Math.abs(incomingVotes)}`;
    return `+ ${incomingVotes}`;
}

module.exports = calculateVotes;