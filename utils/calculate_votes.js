function calculateVotes(totalVotes, incomingVotes) {
    if(incomingVotes < 0) return (totalVotes -= Math.abs(incomingVotes));
    return totalVotes += incomingVotes;
}

module.exports = calculateVotes;