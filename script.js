const gallery = document.querySelector("#gallery-img"); // галерея картинок
const selectAnimals = document.querySelector("#gallery-select_animals"); // выбор животных
const loader = document.querySelector("#gallery-loader"); // лоадер

document
  .querySelector("#gallery-button_load-img")
  .addEventListener("click", (event) => {
    // Подписка на событие Клик по кнопке Загрузить фото

    event.preventDefault(); // Отменяем поведение браузера по умолчанию, которое происходит при обработке события

    gallery.classList.add("none"); // Скрыть галерею

    gallery.innerHTML = ""; // Очистка галереи

    loader.classList.remove("none"); // Включение лоадера перед отправкой запроса

    let apiUrl; // Url загрузки изображений в зависимости от выбранного типа животных (API)

    switch (
      selectAnimals.value // Выбор типа животных
    ) {
      case "dogs":
        apiUrl = "https://dog.ceo/api/breeds/image/random/20"; // Собаки
        break;
      case "cats":
        apiUrl = "https://api.thecatapi.com/v1/images/search?limit=10"; // Кошки
        break;
    }

    // Отправка запроса на загрузку url изображений
    fetch(apiUrl)
      .then((response) => {
        // Обработка ответа

        if (!response.ok) {
          // Обработка ошибок
          throw new Error(`Ошибка: ${response.status}`);
        }

        return response.json();
      })

      .then((data) => {
        // Обработка полученного объекта данных

        function getUrlDogs(data) {
          // Функция получает массив url фотографий собак из dog.ceo
          try {
            // Если данные получены
            if (data.message) {
              return data.message;
            }
          } catch (error) {
            // Если возникла ошибка
            console.log(
              "Ошибка при выполнении функции getUrlDogs(data): ",
              error
            );
          }
        }
        // Функция получает массив url фотографий кошек из api.thecatapi.com
        function getUrlCats(data) {
          try {
            // Временный массив, куда сложим полученные url фотографий кошек
            const arrUrlCats = [];

            // Данные получены
            if (data) {
              // Переберем массив объектов
              data.forEach((obj) => {
                // Проверка на наличие url
                if (obj.url) {
                  // Добавляем url во временный массив
                  arrUrlCats.push(obj.url);
                }
              });
              // Возвращаем полученный массив
              return arrUrlCats;
            }
          } catch (error) {
            console.log(
              "Ошибка при выполнении функции getUrlCats(data): ",
              error
            );
          }
        }

        // Получаем url изображений
        const imagesUrl =
          selectAnimals.value === "dogs" ? getUrlDogs(data) : getUrlCats(data);

        // Количество полученных url изображений
        let numberImagesUrl = imagesUrl.length;
        // Счетчик загруженных изображений
        let counterLoadedImg = 0;

        // Добавляем url изображений в галерею
        imagesUrl.forEach((imageUrl) => {
          // Создаем элемент галереи
          const galleryItem = document.createElement("div");
          // Добавляем стили
          galleryItem.classList.add("gallery-img__item");

          // Создаем элемент изображения
          const image = new Image();
          image.src = imageUrl;
          image.alt = "Фотография животного";
          // Отследим загрузку изображений
          image.onload = function () {
            // Добавляем в счетчик загруженное изображение
            counterLoadedImg = counterLoadedImg + 1;

            // Выводим в консоль прогресс загрузки изображений
            console.log(
              `Изображений загружено: ${counterLoadedImg} из ${numberImagesUrl}`
            );

            // Все изображения загружены
            if (counterLoadedImg === numberImagesUrl) {
              // Скрываем лоадер после завершения загрузки
              loader.classList.add("none");
              // Показываем галерею
              gallery.classList.remove("none");
              // Выводим в консоль статус результата
              console.log("Все изображения в галерею загружены!");
            }
          };
          // Добавим элемент изображения в элемент галереи
          galleryItem.appendChild(image);
          // Добавим элемент галереи в галерею
          gallery.appendChild(galleryItem);
        });
      })

      // Обработаем возможные ошибки загрузки изображений
      .catch((error) => {
        console.error("Ошибка загрузки изображений:", error);
      })

      // Обрабатываем завершение получение ссылок на изображения
      .finally(() => {
        console.log("Ссылки на изображения для галереи получены!");
      });
  });
