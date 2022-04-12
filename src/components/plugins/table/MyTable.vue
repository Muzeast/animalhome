<template>
	<Layout>
		<div style="max-height: 500px; overflow: scroll;">
			<table class="mstable">
				<thead class="msthead">
					<tr>
						<th v-for="(item, index) in columns" :key="index">
							{{ item.title }}
						</th>
					</tr>
				</thead>
				<tbody class="msbody">
					<tr :class="{'mstr': stripe && (i % 2) == 0}" v-for="(da, i) in data" :key="i">
						<mytd v-for="(item, index) in columns" :key="index" :params="bind_data(item, da)"/>
					</tr>
				</tbody>
			</table>
		</div>
	</Layout>
</template>

<script>
import mytd from '@/components/plugins/table/MyTd'
export default {
	name: 'MyTable',
	components: { mytd },
	data () {
		return {
			//
		}
	},
	props: {
		stripe: {
			type: Boolean,
			default: false
		},
		columns: {
			type: Array,
			required: true
		},
		data: {
			type: Array,
			required: true
		}
	},
	methods: {
		bind_data (column, data) {
			if (data[column.key] != null) {
				if (column.render) {
					return {
						render: column.render,
						row: data
					}
				} else {
					return {
						row: data[column.key]
					}
				}
			}
		}
	}
}
</script>

<style type="text/css">
	.mstable {
		width: 100%;
		margin-top: 10px;
		border: 0;
	}
	.msthead {
		height: 40px;
		background: #CCC;
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		z-index: 10;
	}
	.msbody {
		background: #FFF;
	}
	.msbody td {
		padding: 5px 0 5px 0;
	}
	.mstr td{
		background-color:#E9EBEC;
		height:25px;
		line-height:150%;
		border: 1px solid #E8EAEC;
	}
</style>