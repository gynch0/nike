const cartItems = [];

function updateCartModal() {
	const list = document.getElementById("cart-list");
	const footer = document.getElementById("cart-footer");
	const totalCount = document.getElementById("cart-total-count");

	if (!list) return;

	list.innerHTML = "";

	if (cartItems.length === 0) {
		list.innerHTML = '<li class="modal-cart__empty">Корзина пуста</li>';
		if (footer) footer.hidden = true;
		return;
	}

	cartItems.forEach((item, index) => {
		const li = document.createElement("li");
		li.className = "modal-cart__item";

		const img = document.createElement("img");
		img.className = "modal-cart__item-img";
		img.src = item.src;
		img.alt = item.name;
		img.width = 60;
		img.height = 45;

		const span = document.createElement("span");
		span.className = "modal-cart__item-name";
		span.textContent = item.name;

		const btn = document.createElement("button");
		btn.className = "modal-cart__item-remove";
		btn.dataset.index = index;
		btn.setAttribute("aria-label", "Удалить");
		btn.textContent = "✕";

		li.appendChild(img);
		li.appendChild(span);
		li.appendChild(btn);
		list.appendChild(li);
	});

	if (footer) {
		footer.hidden = false;
		totalCount.textContent = cartItems.length;
	}

	list.querySelectorAll(".modal-cart__item-remove").forEach((btn) => {
		btn.addEventListener("click", () => {
			const i = parseInt(btn.dataset.index);
			cartItems.splice(i, 1);
			updateCartModal();
			updateBadge();
		});
	});
}

function updateBadge() {
	const cartBtn = document.querySelector('[aria-label="Корзина"]');
	if (!cartBtn) return;
	const badge = cartBtn.querySelector(".header__cart-badge");
	if (!badge) return;
	if (cartItems.length === 0) {
		badge.hidden = true;
	} else {
		badge.textContent = cartItems.length;
		badge.hidden = false;
	}
}

function flyToCart() {
	const links = document.querySelectorAll(".top-models__product-link");
	const cartBtn = document.querySelector('[aria-label="Корзина"]');

	if (!cartBtn) return;

	const badge = cartBtn.querySelector(".header__cart-badge");

	links.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();

			const img = link.querySelector("img");
			if (!img) return;

			const name =
				link.querySelector(".top-models__product-title")?.textContent?.trim() || "Товар";

			const imgRect = img.getBoundingClientRect();
			const cartRect = cartBtn.getBoundingClientRect();

			const clone = document.createElement("img");
			clone.src = img.src;
			clone.style.cssText = `
				position: fixed;
				z-index: 9999;
				pointer-events: none;
				width: ${imgRect.width}px;
				height: ${imgRect.height}px;
				top: ${imgRect.top}px;
				left: ${imgRect.left}px;
				object-fit: cover;
				border-radius: 8px;
				transition: top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				            left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				            width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				            height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				            opacity 0.8s ease,
				            border-radius 0.8s ease;
			`;
			document.body.appendChild(clone);

			clone.getBoundingClientRect();

			clone.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`;
			clone.style.left = `${cartRect.left + cartRect.width / 2 - 15}px`;
			clone.style.width = "30px";
			clone.style.height = "30px";
			clone.style.opacity = "0";
			clone.style.borderRadius = "50%";

			clone.addEventListener(
				"transitionend",
				() => {
					clone.remove();

					cartItems.push({ src: img.src, name });

					if (badge) {
						badge.textContent = cartItems.length;
						badge.hidden = false;
						badge.classList.add("header__cart-badge--pop");
						badge.addEventListener(
							"animationend",
							() => badge.classList.remove("header__cart-badge--pop"),
							{ once: true },
						);
					}

					cartBtn.classList.add("header__actions-button--bounce");
					cartBtn.addEventListener(
						"animationend",
						() => cartBtn.classList.remove("header__actions-button--bounce"),
						{ once: true },
					);
				},
				{ once: true },
			);
		});
	});
}

export { flyToCart, updateCartModal };
