import React, { useEffect } from 'react';
import cn from 'classnames';

const paths = [
  "/img/sersi.png",
  "/img/deyeneris.png",
  "/img/john.png",
  "/img/rock.png",
  "/img/ginger.png",
  "/img/ramsey.png",
  "/img/khal.png",
  "/img/tormund.png",
];

const punches = [
  'Удар ножом',
  'Вертуха',
  'Ураганный ветер',
  '1000 ударов Будды',
  'Удар Звездный Коллапс',
  'Швырнул луной',
  'Удушающий',
  'Выстрел со Стечкина',
  'Подул',
  'С сальтухи в рожу',
  'Гейский бросок дротика',
  'Расчленил',
  'Fatality',
  'Brutality',
  'Отравленная шаурма',
  'Перо индейца',
  'Дал леща',
  'Удар с меча Нэда Старка',
  'На сей раз не воскреснет',
  'Пошевелить прядью',
  'Бэтаранг',
  'Яростный удар тхэквандо',
  'Драконий ожог',
  'Воздушная бомбардировка',
  'X-ray',
  'Сломал череп',
  'Удар Короля Артура',
  'Стрела Робин Гуда',
  'Рассечение мечом',
  'Отсечение головы',
  'Выпад кошки',
];

function App() {
  const [users, setUsers] = React.useState([]);
  const [fighters, setFighters] = React.useState([]);
  const [choosedFighters, setChoosedFighters] = React.useState([]);
  const [currentPlayer, setCurrentPlayer] = React.useState(1);
  const [winnerNumber, setWinnerNumber] = React.useState(null);
  const [fightCounter, setFightCounter] = React.useState(5);
  const [battleStarted, setBattleStarted] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [playersHP, setPlayersHP] = React.useState({
    fighter1: 100,
    fighter2: 100,
  });

  const getFighters = async (path) => {
    const response = await fetch('/api/fighters', {
      method: 'POST',
      body: JSON.stringify({ reqPath: path }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  useEffect( () => {
    Promise.all(paths.map(path => getFighters(path))).then((resolvedValues) => {
      setFighters(resolvedValues);
    });
  }, []);

  const getUsers = async () => {
    const response = await fetch('/api/users', { method: 'GET' });
    const { users } = await response.json();

    setUsers(users);
  };

  const handleChooseFighter = (url) => {
    if (choosedFighters.length === 2) return;
    setCurrentPlayer(2);
    setChoosedFighters([...choosedFighters, url])
  };

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor((Math.random() * (max - min + 1))) + min); //Максимум и минимум включаются
  }

  const chooseWinner = () => {
    const winNum = getRandomIntInclusive(1, 2);
     setWinnerNumber(winNum);
  }


  const getRandomDamage = (playerNumber, damage) => {
    const player = `fighter${playerNumber}`
    const hpAfterDamage = playersHP[player] - damage;
    const resultHp = hpAfterDamage <= 0 ? 0 : hpAfterDamage;

    setPlayersHP({
      ...playersHP,
      [player]: resultHp,
    })
  };


  useEffect(() => {
    if (!finished && battleStarted && choosedFighters.length === 2) {
      const timer = setInterval(() => {
        setFightCounter(fightCounter - 1);
        const fighterNumber = getRandomIntInclusive(1, 2);
        if (fighterNumber === 1) {
          console.log(`😡😡😡😡😡😡😡😡😡😡Удар игрока ${fighterNumber} 😡😡😡😡😡😡😡😡😡😡`);
        }

        if (fighterNumber === 1) {
          console.log(`🤢🤢🤢🤢🤢🤢🤢🤢🤢Удар игрока ${fighterNumber} 🤢🤢🤢🤢🤢🤢🤢🤢🤢🤢🤢`);
        }
        console.log(`🔥🔥🔥🔥🔥🔥🔥🔥 ${punches[getRandomIntInclusive(0, 30)]} 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥`)
        getRandomDamage(fighterNumber, getRandomIntInclusive(0, 50));
      }, 2000);

      if (fightCounter === 0) {
        clearInterval(timer);
        setBattleStarted(false);
        setFinished(true);
        setFightCounter(5);
        chooseWinner();
      }

      return () => {
        clearInterval(timer);
      };
    }
  }, [battleStarted, fightCounter]);

  useEffect(() => {
    const { fighter1, fighter2 } = playersHP;

    if (fighter1 > fighter2) {
      setWinnerNumber(1);
    } else {
      setWinnerNumber(2);
    }
  }, [playersHP.fighter1, playersHP.fighter2])

  const startFight = () => {
    setWinnerNumber(null);
    setBattleStarted(true);
    setFinished(false);
    setPlayersHP({
      fighter1: 100,
      fighter2: 100,
    });
  }

  const handleResetFighters = () => {
    setChoosedFighters([]);
    setFinished(false);
    setBattleStarted(false);
    setWinnerNumber(null);
    setCurrentPlayer(1)
    setPlayersHP({
      fighter1: 100,
      fighter2: 100,
    })
  };

  return (
    <div className="App">
      <ul>
        {!users ? "Loading..." : users.map((user) => {
          return <li>
            <div style={{ width: 300, display: 'inline-block' }}>
              <span style={{ color: 'red' }}> Имя: </span>
              {user.name}
            </div>

            <div style={{ width: 200, display: 'inline-block' }}>
              <span style={{ color: 'green' }}> Чин: </span>
              {user.position}
            </div>
          </li>
        })}
        <div className="grid">
          {fighters.map(fighter => {
            return <div >
              <img onClick={() => handleChooseFighter(fighter)}
                   className={currentPlayer === 1 ? "grow redborder" : 'grow greenborder'}
                   src={fighter}  alt="fighter" />
            </div>
          })}
        </div>
      </ul>
      {/*<button onClick={getUsers}>Запросить с сервера бойцов</button>*/}
      {/*<button onClick={getFighters}>Запросить с сервера фото</button>*/}
      {fightCounter > 0 && battleStarted &&
        <div style={{ fontSize: 24, textAlign: 'center' }}>
          Бой идет. Осталось: {fightCounter}
        </div>}
      {choosedFighters.length === 2 && !finished &&
      <div style={{ fontSize: 40, textAlign: 'center' }}>Выбранные герои</div>}
      {finished &&
      <div style={{
        fontSize: 40,
        textAlign: 'center',
        cursor: 'pointer',
      }}>
        <div
          onClick={handleResetFighters}
          style={{
          width: 500,
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '2px solid'
        }}>
          Выбрать других героев
        </div>
      </div>}
      <div className="choosed_fighters">
        {choosedFighters.length === 2 &&
        <div className="health-container">
          <div className="hp-line">
            <div className="hp" style={{ backgroundColor: 'red', width: playersHP.fighter1 }}>
              Fighter 1
            </div>
          </div>
          <div className="hp-line">
            <div className="hp" style={{ backgroundColor: 'red', width: playersHP.fighter2 }}>
              Fighter 2
            </div>
          </div>
        </div>}
        {choosedFighters.length > 0 && choosedFighters.map((choosed, index) => {
          if (index === 1) return (
            <>
              <h1 className="button" onClick={startFight}>Fight!</h1>
              <div className="flip-card">
              <div className="flip-card-inner">
                <div className={cn("flip-card-front", {
                  'infiniteRotation': battleStarted,
                  'lost': finished && typeof winnerNumber === 'number' && winnerNumber !== 2,
                })}>
                  <img className={index === 0 ? "grow redborder_choosed" : 'grow greenborder_choosed'}
                       src={choosed}  alt="fighter" />
                </div>
                {finished &&
                <div className={cn("flip-card-back", {
                  "loser-text": winnerNumber === 1,
                  "winner-text": winnerNumber === 2,
                })}>{`${winnerNumber === 2 ? 'winner' : 'dead'}`}</div>}
                </div>
              </div>

            </>
          )
          return <div className="flip-card">
            <div className="flip-card-inner">
              <div className={cn("flip-card-front", {
                'infiniteRotation': battleStarted,
                'lost': finished && typeof winnerNumber === 'number' && winnerNumber !== 1,
              })}>
                <img className={index === 0 ? "grow redborder_choosed" : 'grow greenborder_choosed'}
                     src={choosed}  alt="fighter" />
              </div>
              {finished &&
              <div className={cn("flip-card-back", {
                "loser-text": winnerNumber === 2,
                "winner-text": winnerNumber === 1,
              })}>{`${winnerNumber === 1 ? 'winner' : 'dead'}`}
              </div>}
            </div>
          </div>
        })}
      </div>
    </div>
  );
}

export default App;
