$(document).ready(initialize);

// -----------------------------------------------[Initialization]----------------->

function initialize(){
  // Functions for moving several similar lines of code out of the way
  // for a cleaner look and higher readability.
  hidePages();
  loadClickHandlers();
}

// -----------------------------------------------[Global Variables]----------------->

// Sets the initial empty values for the base rate and rule array.
var baseRate = 0;
var ruleArray = [];

// -----------------------------------------------[Click Functions]----------------->

function clickStartButton(){
  // Initial page is never used again until refresh.
  $(".landingPage").fadeOut('fast');
  $(".newCalculatorPage").removeClass('hidden').fadeIn(2000);
}

function clickSetButton(){
  // Sets the base rate, checking for negative or empty field values.
  var baseRateValue = parseFloat($("#baseRateField").val());
  if(baseRateValue <= 0 || isNaN(baseRateValue)){
    alert("You must enter a positive base rate.");
  } else {
    baseRate += baseRateValue;

    // Clears the fields and changes pages, then makes the rate visible for confirmation.
    $("#baseRateField").val('');
    // This method used for changing views is repeated throughout this section, making for
    // a seamless transition between "pages" without clunky overlap on load.
    $(".newCalculatorPage").fadeOut('fast').addClass('hidden').hide();
    $(".optionPage").removeClass('hidden').fadeIn(2000);
    $("#baseRate").text(baseRate);
  }
}

function clickAddRuleButton(){
  $(".optionPage").fadeOut('fast').addClass('hidden').hide();
  $(".addRulePage").removeClass('hidden').fadeIn(2000);
}

function clickAddAnotherRuleButton(){
  $(".addRuleSuccessPage").fadeOut('fast').addClass('hidden').hide();
  $(".addRulePage").removeClass('hidden').fadeIn(2000);
  $("#ruleConditionField").focus();
}

function clickSaveRuleButton(){
  // Setting variables for each input on the rule page.
  var ruleValue = parseFloat($("#ruleValueField").val());
  var ruleCondition = $("#ruleConditionField").val();

  // Checking for empty fields.
  if(ruleCondition == '' || ruleValue <= 0 || isNaN(ruleValue) || !$("#addRadio").is(':checked') && !$("#subtractRadio").is(':checked')){
    alert("Please make sure all fields are filled in correctly and an add/subtract option is checked.");
  }else{
    // Creates a rule object, then pushes it into the ruleArray.
    var rule = {};
    rule.name = ruleCondition;
    rule.value = ruleValue;

    // Checks for which box is selected, then sets the value as such.
    if ($("#addRadio").is(':checked')){
      rule.checked = "add";
    } else if ($("#subtractRadio").is(':checked')) {
      rule.checked = "subtract";
    }

    ruleArray.push(rule);

    // Clearing the fields and radio buttons for later use of the page.
    ruleClear()
    $(".addRulePage").fadeOut('fast').addClass('hidden').hide();
    $(".addRuleSuccessPage").removeClass('hidden').fadeIn(2000);
  }
}

function clickStartOverButton(){
  // Resets the rule array and base rate to empty values.
  ruleArray.length = 0;
  var subtractedBaseRate = baseRate;
  baseRate -= subtractedBaseRate;

  $(".optionPage").fadeOut('fast').addClass('hidden').hide();
  $(".addRuleSuccessPage").fadeOut('fast').addClass('hidden').hide();
  $(".calculatorPage").fadeOut('fast').addClass('hidden').hide();
  $(".newCalculatorPage").removeClass('hidden').fadeIn(2000);
  $("#baseRateField").focus();
}

function clickStartOverButtonTiny(){
  // Simply refreshing the page.
  location.reload();
}

function clickCancelButton(){
  ruleClear()
  $(".addRulePage").fadeOut('fast').addClass('hidden').hide();
  $(".optionPage").removeClass('hidden').fadeIn(2000);
}

function clickGoButton(){
  // Brings up the final page where the calculations will take place.
  // Only shows the "Toggle Rules" section if rules are present.
  $(".addRuleSuccessPage").fadeOut('fast').addClass('hidden').hide();
  $(".optionPage").fadeOut('fast').addClass('hidden').hide();
  $(".calculatorPage").removeClass('hidden').fadeIn(2000);
  $("#finalBaseRate").text(baseRate);
  if(ruleArray.length == 0){
    $(".addRuleToggle").hide();
    $("#rulesBox").removeClass('hidden')
  }
}

function clickAddRuleToggle(){
  // Trades the "Toggle Rules" button for a box that will display all rules.
  // Then, it populates the box with the rules themselves via a for loop.
  $(".addRuleToggle").fadeOut('fast').addClass('hidden').hide();
  $("#rulesBox").removeClass('hidden').fadeIn(2000);
  for(var i = 0; i < ruleArray.length; i++){
    var specificRule = ruleArray[i];
    var $rule = $('<input type="checkbox" class="rule" value="' + i + '">' + specificRule.name + '</input>');
    $("#rulesBox").append($rule);
  }
}

function clickCalculateButton(){
  var finalPrice = 0;
  var hours = parseFloat($("#hourField").val());
  finalPrice += baseRate * hours;
  $("#finalPrice").text(finalPrice);
}

// -----------------------------------------------[Rate Modification Functions]----------------->

// Both of these functions simply adjust the amounts on the page in realtime depending on the
// addition/subtraction parameter selected by the user upon rule creation.

function increaseRate(selected){
  var amount = selected.value;
  if (selected.checked == "add"){
    baseRate += amount;
  } else {
    baseRate -= amount;
  }
  $('#finalBaseRate').text(baseRate);
}

function decreaseRate(selected){
  var amount = selected.value;
  if (selected.checked == "add"){
    baseRate -= amount;
  } else {
    baseRate += amount;
  }
  $('#finalBaseRate').text(baseRate);
}

// -----------------------------------------------[Hidden Pages]----------------->

function hidePages(){
  // Makes sure jQuery sees these pages as hidden for use of the fade methods, despite
  // the use of the "hidden" class.
  $(".newCalculatorPage").hide();
  $(".optionPage").hide();
  $(".addRulePage").hide();
  $(".addRuleSuccessPage").hide();
  $(".calculatorPage").hide();
  $(".rulesBox").hide();
}

// -----------------------------------------------[Click Handlers]----------------->

function loadClickHandlers(){
  // Sets up the page to always be looking for click actions past the initial load.
  $(".container").on("click", ".startButton", clickStartButton);
  $(".container").on("click", ".setButton", clickSetButton);
  $(".container").on("click", ".startOverButton", clickStartOverButton);
  $(".container").on("click", ".startOverButtonTiny", clickStartOverButtonTiny);
  $(".container").on("click", ".addRuleButton", clickAddRuleButton);
  $(".container").on("click", ".addAnotherRuleButton", clickAddAnotherRuleButton);
  $(".container").on("click", ".saveRuleButton", clickSaveRuleButton);
  $(".container").on("click", ".cancelButton", clickCancelButton);
  $(".container").on("click", ".goButton", clickGoButton);
  $(".container").on("click", ".addRuleToggle", clickAddRuleToggle);
  $(".container").on("click", ".calculateButton", clickCalculateButton);
  $("#rulesBox").on("change", ".rule", checkboxChange);
}

// -----------------------------------------------[Moved Functions]----------------->

function ruleClear(){
  // Moved here for cleanliness of code.
  $("#ruleConditionField").val('');
  $("#ruleValueField").val('');
  $('#addRadio').prop('checked', false);
  $('#subtractRadio').prop('checked', false);
}

function checkboxChange(){
  // Checks for the related object in the ruleArray, then pulls its values and
  // sends them to the appropriate function.
  var $selected = ruleArray[parseFloat(this.value)];
  if ($(this).is(':checked')){
    increaseRate($selected);
  } else if (!$(this).is(':checked')){
    decreaseRate($selected);
  }
}









