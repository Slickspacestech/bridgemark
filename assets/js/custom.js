$(document).ready(function () {
  "use strict";

  /*=========== 1. Scroll To Top ===========*/
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 600) {
      $(".return-to-top").fadeIn();
    } else {
      $(".return-to-top").fadeOut();
    }
  });

  $(".return-to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500);
    return false;
  });

  /*=========== 2. Global Helpers & Scrollspy ===========*/

  function getHeaderHeight() {
    return $(".header-area").outerHeight() || 0;
  }

  function scrollToServicesSection() {
    var hHeight = getHeaderHeight();
    var offset = $("#services").offset().top - (hHeight - 2);
    $("html, body").stop().animate({ scrollTop: offset }, 600, "easeInOutExpo");
  }

  $("body").scrollspy({
    target: ".navbar-collapse",
    offset: getHeaderHeight() + 10,
  });

  /*=========== 3. Smooth Scroll (Main Sections) ===========*/
  $("li.smooth-menu a, .sub-header>a").bind("click", function (event) {
    // Skip if it's a dropdown toggle to let dynamic navigation handle it
    if ($(this).hasClass("dropdown-toggle")) return;

    var anchor = $(this);
    var href = anchor.attr("href");

    if (href && href.startsWith("#") && $(href).length) {
      event.preventDefault();
      var hHeight = getHeaderHeight();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(href).offset().top - (hHeight - 2),
          },
          600,
          "easeInOutExpo"
        );
    }
  });

  /*=========== 4. Services Dynamic Navigation (Corrected) ===========*/

  // A. Logic to Reset to Services Intro
  // Combined the navbar button, "All Services" buttons, and sub-page center links
  $(document).on(
    "click",
    ".nav-stacked-menu > a.dropdown-toggle, #back-to-intro, #back-to-intro-others, .nav-center-link",
    function (e) {
      // Only intercept if the link is specifically for #services
      if (
        $(this).attr("href") === "#services" ||
        $(this).hasClass("nav-center-link")
      ) {
        e.preventDefault();
        e.stopPropagation(); // Stops template scripts from blocking the view change

        // UI Reset
        $(".service-view").hide();
        $("#services-main").stop().fadeIn(700);
        $(".dropdown-menu li").removeClass("active-service");

        // Desktop: Keep parent highlighted; Mobile: Parent cleared by sub-link logic
        if ($(window).width() > 992) {
          $(".nav-stacked-menu").addClass("active");
        }

        scrollToServicesSection();
      }
    }
  );

  // B. Logic to Switch to Specific Sub-Pages (Advisory, Dev Mgmt, etc.)
  $(document).on(
    "click",
    ".dropdown-menu a, .service-link, .nav-next-link, .nav-back-link",
    function (e) {
      var targetId = $(this).attr("data-filter");

      if (targetId) {
        e.preventDefault();
        e.stopPropagation();

        // Switch View
        $(".service-view").hide();
        $("#" + targetId)
          .stop()
          .fadeIn(700);

        // Handle Highlights
        $(".dropdown-menu li").removeClass("active-service");
        $('.dropdown-menu a[data-filter="' + targetId + '"]')
          .parent("li")
          .addClass("active-service");

        // Mobile Specific: Remove parent 'active' so only the sub-link is orange
        if ($(window).width() <= 992) {
          $(this).closest(".nav-stacked-menu").removeClass("active");
          $(".nav > li").removeClass("active");
        }

        scrollToServicesSection();
      }
    }
  );

  /*=========== 5. Contact Form Submission ===========*/
  $(".contact-btn").on("click", function (e) {
    e.preventDefault();
    var form = $(this).closest("form");
    var originalBtnText = $(this).text();

    var formData = {
      firstname: $("#firstname").val().trim(),
      lastname: $("#last").val().trim(),
      phone: $("#phone").val().trim(),
      email: $("#email").val().trim(),
      subject: $("#subject").val().trim(),
      message: $("#comment").val().trim(),
      signup: $("#signup").is(":checked") ? 1 : 0,
    };

    // Validate required fields
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill in all required fields marked with (*)");
      return false;
    }

    // Basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    $(this).text("Sending...");

    $.ajax({
      type: "POST",
      url: "/.netlify/functions/contact-form",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        if (response.success) {
          alert(
            response.message ||
              "Thank you for contacting us! We will get back to you soon."
          );
          form[0].reset();
        } else {
          alert(response.error || "An error occurred. Please try again later.");
        }
        $(".contact-btn").text(originalBtnText);
      },
      error: function (xhr) {
        var errorMessage = "An error occurred. Please try again later.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        }
        alert(errorMessage);
        $(".contact-btn").text(originalBtnText);
      },
    });
  });

  /*=========== Updated Projects Logic ===========*/

  // 1. Page Navigation on the back of the card
  $(document).on("click", ".change-page-btn", function (e) {
    e.preventDefault();
    e.stopPropagation(); // Stops the card from flipping shut

    const targetPage = parseInt($(this).data("page"));
    const $wrapper = $(this).closest(".back-pages-wrapper");

    // Slide calculation: moves the entire track left
    const offset = (targetPage - 1) * 100;
    $wrapper.css("transform", "translateX(-" + offset + "%)");
  });

  // 2. Main Flip Trigger
  $(".project-card").on("click", function (e) {
    // Ignore if clicking a navigation button
    if ($(e.target).closest(".change-page-btn").length) return;

    const $inner = $(this).find(".card-inner");
    const $wrapper = $(this).find(".back-pages-wrapper");

    $inner.toggleClass("is-flipped");

    // Reset to Page 1 when flipping closed
    if (!$inner.hasClass("is-flipped")) {
      setTimeout(() => {
        $wrapper.css("transform", "translateX(0%)");
      }, 500);
    }

    // Auto-close other cards
    $(".project-card").not(this).find(".card-inner").removeClass("is-flipped");
  });
  // Desktop Hover Protection: Reset page state when mouse leaves
  $(".project-card").on("mouseleave", function () {
    const $wrapper = $(this).find(".back-pages-wrapper");
    const $inner = $(this).find(".card-inner");

    // Only reset if the card isn't manually flipped (for hybrid devices)
    if (!$inner.hasClass("is-flipped")) {
      $wrapper.css("transform", "translateX(0%)").data("currentIndex", 0);
    }
  });

  // Auto-close Hamburger menu
  $(document).on("click", ".navbar-collapse a", function () {
    // Don't auto-close if clicking the parent 'Services' dropdown on mobile
    if ($(window).width() <= 992 && !$(this).hasClass("dropdown-toggle")) {
      if ($(".navbar-toggle").is(":visible")) {
        $(".navbar-toggle").trigger("click");
      }
    }
  });

  /*=========== 8. Template Extras (Carousel & Progress) ===========*/
  if ($(".progress-bar").length) {
    $(".progress-bar").appear(function () {
      $('[data-toggle="tooltip"]')
        .tooltip({ trigger: "manual" })
        .tooltip("show");
      $(".progress-bar").each(function () {
        $(this).width($(this).attr("aria-valuenow") + "%");
      });
    });
  }

  if ($("#client").length) {
    $("#client").owlCarousel({
      items: 7,
      loop: true,
      smartSpeed: 1000,
      autoplay: true,
      dots: false,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 2 },
        415: { items: 2 },
        600: { items: 4 },
        1199: { items: 4 },
        1200: { items: 7 },
      },
    });
  }
});
