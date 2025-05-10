import config from '../config.cjs';

const games = {};

const renderBoard = (board) => {
  return board.map((row, i) =>
    row.map((cell, j) => cell || `${3 * i + j + 1}`).join(" | ")
  ).join("\n---------\n");
};

const checkWinner = (b, p) =>
  [0, 1, 2].some(i => b[i].every(c => c === p)) || // rows
  [0, 1, 2].some(i => [b[0][i], b[1][i], b[2][i]].every(c => c === p)) || // cols
  [b[0][0], b[1][1], b[2][2]].every(c => c === p) || // diag
  [b[0][2], b[1][1], b[2][0]].every(c => c === p); // anti-diag

const tictactoe = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const args = m.body.trim().split(/ +/).slice(1);
    const gameId = m.from;

    if (!['tictactoe', 'xo', 'ttt'].includes(cmd)) return;

    if (!games[gameId]) {
      if (!m.mentionedJid?.length) return m.reply('Mentionne un joueur pour commencer le jeu !');
      const p1 = m.sender;
      const p2 = m.mentionedJid[0];

      games[gameId] = {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        turn: p1,
        players: [p1, p2],
        symbols: { [p1]: '❌', [p2]: '⭕' },
        step: 0
      };

      return gss.sendMessage(gameId, {
        text: `🎮 *Tic Tac Toe Started!*\n\n${renderBoard(games[gameId].board)}\n\n@${p1.split('@')[0]} (❌) vs @${p2.split('@')[0]} (⭕)\n\n👉 It's @${p1.split('@')[0]}'s turn. Send a number (1-9) to play.`,
        mentions: [p1, p2]
      }, { quoted: m });
    }

    const game = games[gameId];

    if (!game.players.includes(m.sender)) return;
    if (game.turn !== m.sender) return m.reply("Ce n'est pas ton tour !");
    if (!['1','2','3','4','5','6','7','8','9'].includes(cmd)) return m.reply("Choisis un chiffre entre 1 et 9.");

    const pos = parseInt(cmd) - 1;
    const row = Math.floor(pos / 3);
    const col = pos % 3;

    if (game.board[row][col]) return m.reply("Cette case est déjà prise !");

    game.board[row][col] = game.symbols[m.sender];
    game.step++;

    if (checkWinner(game.board, game.symbols[m.sender])) {
      const winner = m.sender;
      delete games[gameId];
      return gss.sendMessage(gameId, {
        text: `${renderBoard(game.board)}\n\n🎉 @${winner.split('@')[0]} a gagné la partie !`,
        mentions: [winner]
      });
    }

    if (game.step === 9) {
      delete games[gameId];
      return gss.sendMessage(gameId, {
        text: `${renderBoard(game.board)}\n\n🤝 Match nul !`
      });
    }

    game.turn = game.players.find(p => p !== m.sender);

    return gss.sendMessage(gameId, {
      text: `${renderBoard(game.board)}\n\n👉 C'est au tour de @${game.turn.split('@')[0]}.`,
      mentions: [game.turn]
    });

  } catch (err) {
    console.error('TicTacToe error:', err);
    m.reply('❌ Une erreur est survenue.');
  }
};

export default tictactoe;
