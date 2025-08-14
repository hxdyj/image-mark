export class EventBusEventName {
	static init = 'init'
	static first_render = 'first_render'
	static rerender = 'rerender'
	static draw = 'draw'
	static resize = 'resize'
	static scale = 'scale'

	static container_drag_enter = 'container_drag_enter'
	static container_drag_over = 'container_drag_over'
	static container_drag_leave = 'container_drag_leave'
	static container_drop = 'container_drop'

	static shape_delete = 'shape_delete'
	static shape_delete_all = 'shape_delete_all'
	static shape_add = 'shape_add'
	static shape_end_drawing = 'shape_end_drawing'
	static shape_after_render = 'shape_after_render'
	static shape_plugin_set_data = 'shape_plugin_set_data'

	static selection_select_list_change = 'selection_select_list_change'
	static selection_action_click = 'selection_action_click'


	static load_image_error = 'load_image_error'
}
