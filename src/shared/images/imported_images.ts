import { createImgUrl } from './img'

const about = createImgUrl('about.png')
const add = createImgUrl('add_16.png')
const arrow_down_blue = createImgUrl('arrow_down_blue.png')
const arrow_right_blue = createImgUrl('arrow_right_blue.png')
const arrow_right_green = createImgUrl('arrow_right_green.png')
const arrow_up_blue = createImgUrl('arrow_up_blue.png')
const attention = createImgUrl('attention_16.png')
const ball_green = createImgUrl('Ball_Green_16.png')
const ball_red = createImgUrl('Ball_Red_16.png')
const book_open = createImgUrl('book_open_24.png')
const calculator = createImgUrl('calculator.png')
const calendar = createImgUrl('calendar_24.png')
const certificate = createImgUrl('certificate_16.png')
const certificate_add = createImgUrl('certificate_add_16.png')
const certificate_add_y = createImgUrl('certificate_add_y_16.png')
const certificate_gray = createImgUrl('certificate_gray_16.png')
const certificate_y = createImgUrl('certificate_y_16.png')
const certificate_y_return = createImgUrl('certificate_y_return_16.png')
const check = createImgUrl('check.png')
const check2 = createImgUrl('check2.png')
const chevron_double_left = createImgUrl('chevron-double-left.png')
const chevron_double_right = createImgUrl('chevron-double-right.png')
const clean = createImgUrl('clean_16.png')
const clock = createImgUrl('clock_16.png')
const clock_yel = createImgUrl('clock_yel_16.png')
const close = createImgUrl('close.png')
const cogs = createImgUrl('cogs.png')
const copy = createImgUrl('copy_16.png')
const delete_img = createImgUrl('delete.png')
const delete2 = createImgUrl('delete2.png')
const delete_yel = createImgUrl('delete_yel.png')
const delete_16 = createImgUrl('delete_16.png')
const disk_blue = createImgUrl('disk_blue_16.png')
const document = createImgUrl('document_16.png')
const document_add = createImgUrl('document_add.png')
const document_certificate = createImgUrl('document_certificate_16.png')
const document_delete = createImgUrl('document_delete.png')
const document_edit = createImgUrl('document_edit.png')
const document_etran = createImgUrl('document_etran_16.png')
const document_plain = createImgUrl('document_plain_16.png')
const documents = createImgUrl('documents_16.png')
const edit = createImgUrl('edit_24.png')
const element = createImgUrl('element_16.png')
const environment = createImgUrl('environment_16.png')
const flag_green = createImgUrl('flag_green_16.png')
const flag_red = createImgUrl('flag_red_16.png')
const flag_yellow = createImgUrl('flag_yellow_16.png')
const folder = createImgUrl('folder.png')
const folder_closed = createImgUrl('folder_closed.png')
const history = createImgUrl('history.png')
const information = createImgUrl('information.png')
const left = createImgUrl('left_24.png')
const left_right = createImgUrl('left_right_24.png')
const max = createImgUrl('max.png')
const menu_down_custom = createImgUrl('menu-down-custom.png')
const menu_right_custom = createImgUrl('menu-right-custom.png')
const message = createImgUrl('message_16.png')
const min = createImgUrl('min.png')
const minus = createImgUrl('minus.png')
const navigate_right2 = createImgUrl('navigate_right2_16.png')
const old_accordion_bar_style = createImgUrl('old_accordion_bar_style.png')
const old_selected_row_style = createImgUrl('old_selected_row_style.png')
const page_excel = createImgUrl('page_excel.png')
const page_word = createImgUrl('page_word.png')
const percent_box_outline = createImgUrl('percent-box-outline.png')
const preferences = createImgUrl('preferences_24.png')
const processes = createImgUrl('processes_16.png')
const public_img = createImgUrl('public_16.png')
const purple_error = createImgUrl('purple_error.png')
const quest_orange = createImgUrl('quest_orange_16.png')
const refresh = createImgUrl('refresh.png')
const right = createImgUrl('right_24.png')
const rzd = createImgUrl('rzd.png')
const star_red = createImgUrl('star_red_16.png')
const stik = createImgUrl('stik_24.png')
const stop = createImgUrl('stop_16.png')
const table_selection_row = createImgUrl('table_selection_row.png')
const text = createImgUrl('text_24.png')
const user1_information = createImgUrl('user1_information_24.png')
const view = createImgUrl('view_24.png')
const warning = createImgUrl('warning_16.png')
const weight = createImgUrl('weight_24.png')

const images = {
  about,
  add,
  arrow_down_blue,
  arrow_right_blue,
  arrow_right_green,
  arrow_up_blue,
  attention,
  ball_green,
  ball_red,
  book_open,
  calculator,
  calendar,
  certificate_add,
  certificate_add_y,
  certificate_gray,
  certificate,
  certificate_y,
  certificate_y_return,
  check,
  check2,
  chevron_double_left,
  chevron_double_right,
  clean,
  clock,
  clock_yel,
  close,
  cogs,
  copy,
  delete_16,
  delete_img,
  delete_yel,
  delete2,
  disk_blue,
  document_add,
  document_certificate,
  document_delete,
  document_edit,
  document_etran,
  document,
  document_plain,
  documents,
  edit,
  element,
  environment,
  flag_green,
  flag_red,
  flag_yellow,
  folder_closed,
  folder,
  history,
  information,
  left,
  left_right,
  max,
  menu_down_custom,
  menu_right_custom,
  message,
  min,
  minus,
  navigate_right2,
  old_accordion_bar_style,
  old_selected_row_style,
  page_excel,
  page_word,
  percent_box_outline,
  preferences,
  processes,
  public_img,
  purple_error,
  quest_orange,
  refresh,
  right,
  rzd,
  star_red,
  stik,
  stop,
  table_selection_row,
  text,
  user1_information,
  view,
  warning,
  weight
} as const

export type ImagesMap = typeof images
export type ImageKey = keyof typeof images
export default images
