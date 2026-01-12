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
      firstname: $("#firstname").val(),
      lastname: $("#last").val(),
      phone: $("#phone").val(),
      email: $("#email").val(),
      subject: $("#subject").val(),
      message: $("#comment").val(),
      signup: $("#signup").is(":checked") ? 1 : 0,
    };

    if (!formData.firstname || !formData.lastname || !formData.email) {
      alert("Please fill in all required fields marked with (*)");
      return false;
    }

    $(this).text("Sending...");

    $.ajax({
      type: "POST",
      url: "send_email.php",
      data: formData,
      success: function (response) {
        alert(response);
        form[0].reset();
        $(".contact-btn").text(originalBtnText);
      },
      error: function () {
        alert("An error occurred. Please try again later.");
        $(".contact-btn").text(originalBtnText);
      },
    });
  });

  /*=========== 6. Projects Filtering ===========*/
  $(".filter-btn").on("click", function () {
    const filterValue = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    if (filterValue === "all") {
      $(".project-card").stop().fadeIn(500);
    } else {
      $(".project-card").stop().hide();
      $('.project-card[data-category="' + filterValue + '"]')
        .stop()
        .fadeIn(500);
    }
  });

  /*=========== 7. Mobile Adjustments (Touch & Auto-Close) ===========*/

  // Project Card Tap to Flip
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    $(".project-card").on("click", function () {
      $(this).find(".card-inner").toggleClass("is-flipped");
      $(".project-card")
        .not(this)
        .find(".card-inner")
        .removeClass("is-flipped");
    });
  }

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
